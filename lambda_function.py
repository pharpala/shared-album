import json
import uuid
import boto3
from botocore.exceptions import ClientError

BUCKET_NAME = "photo-album-cis4010"
REGION = "us-east-1"

s3 = boto3.client("s3", region_name=REGION)

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
}


def respond(body: dict, status: int = 200) -> dict:
    return {
        "statusCode": status,
        "headers": CORS_HEADERS,
        "body": json.dumps(body),
    }


def get_s3_json(key: str) -> dict | None:
    """Fetch and parse a JSON object from S3. Returns None if key does not exist."""
    try:
        obj = s3.get_object(Bucket=BUCKET_NAME, Key=key)
        return json.loads(obj["Body"].read())
    except ClientError as e:
        if e.response["Error"]["Code"] in ("NoSuchKey", "404"):
            return None
        raise


def put_s3_json(key: str, data: dict) -> None:
    s3.put_object(
        Bucket=BUCKET_NAME,
        Key=key,
        Body=json.dumps(data),
        ContentType="application/json",
    )


# ── Action handlers ────────────────────────────────────────────────────────────

def create_album() -> dict:
    album_id = str(uuid.uuid4())
    share_token = str(uuid.uuid4())

    put_s3_json(
        f"albums/{album_id}/meta.json",
        {"albumId": album_id, "shareToken": share_token},
    )
    put_s3_json(
        f"tokens/{share_token}.json",
        {"albumId": album_id},
    )

    return respond({"albumId": album_id, "shareToken": share_token})


def get_upload_url(body: dict) -> dict:
    share_token = body.get("shareToken")
    file_name = body.get("fileName")

    if not share_token or not file_name:
        return respond({"error": "shareToken and fileName are required"}, 400)

    token_data = get_s3_json(f"tokens/{share_token}.json")
    if token_data is None:
        return respond({"error": "Invalid shareToken"}, 404)

    album_id = token_data["albumId"]
    key = f"albums/{album_id}/photos/{file_name}"

    upload_url = s3.generate_presigned_url(
        "put_object",
        Params={"Bucket": BUCKET_NAME, "Key": key},
        ExpiresIn=300,
    )

    return respond({"uploadUrl": upload_url})


def get_photos(body: dict) -> dict:
    share_token = body.get("shareToken")

    if not share_token:
        return respond({"error": "shareToken is required"}, 400)

    token_data = get_s3_json(f"tokens/{share_token}.json")
    if token_data is None:
        return respond({"error": "Invalid shareToken"}, 404)

    album_id = token_data["albumId"]
    prefix = f"albums/{album_id}/photos/"

    paginator = s3.get_paginator("list_objects_v2")
    pages = paginator.paginate(Bucket=BUCKET_NAME, Prefix=prefix)

    urls = []
    for page in pages:
        for obj in page.get("Contents", []):
            url = s3.generate_presigned_url(
                "get_object",
                Params={"Bucket": BUCKET_NAME, "Key": obj["Key"]},
                ExpiresIn=3600,
            )
            urls.append(url)

    return respond({"urls": urls})


# ── Entry point ────────────────────────────────────────────────────────────────

def lambda_handler(event: dict, context) -> dict:
    # Handle CORS preflight
    if event.get("requestContext", {}).get("http", {}).get("method") == "OPTIONS":
        return respond({})

    try:
        raw_body = event.get("body") or "{}"
        body = json.loads(raw_body)
    except json.JSONDecodeError:
        return respond({"error": "Invalid JSON body"}, 400)

    action = body.get("action")

    try:
        if action == "create_album":
            return create_album()
        elif action == "get_upload_url":
            return get_upload_url(body)
        elif action == "get_photos":
            return get_photos(body)
        else:
            return respond({"error": f"Unknown action: {action!r}"}, 400)
    except ClientError as e:
        error_msg = e.response["Error"]["Message"]
        return respond({"error": f"AWS error: {error_msg}"}, 500)
    except Exception as e:
        return respond({"error": str(e)}, 500)
