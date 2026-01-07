terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  profile = "kbaas"
}

variable "bucket_id" {
  type = string
}

locals {
  mime_types = {
    "html" = "text/html"
    "css"  = "text/css"
    "js"   = "application/javascript"
    "png"  = "image/png"
    "jpg"  = "image/jpeg"
    "gif"  = "image/gif"
  }
}

resource "aws_s3_object" "website" {
  for_each = fileset("${path.module}/website", "**/*")

  bucket = var.bucket_id
  key    = each.value
  source = "${path.module}/website/${each.value}"

  content_type = lookup(local.mime_types, split(".", each.value)[length(split(".", each.value)) - 1], "application/octet-stream")
}
