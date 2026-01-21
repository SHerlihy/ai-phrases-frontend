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

variable "bucket_arn" {
    type = string
}

variable "bucket_regional_domain_name" {
    type = string
}

locals {
    disabled_cache = "4135ea2d-6df8-44a3-9df3-4b5a84be39ad"
    uuid = "bb2837d4-06fa-4eb6-8ab3-8f0b3c6d4b09"
}

resource "aws_route53_zone" "phrases" {
  name = "phrases.com"
}

resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name              = var.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.website.id
    origin_id                = local.uuid
  }

  enabled             = true
  is_ipv6_enabled     = true

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.uuid

    viewer_protocol_policy = "redirect-to-https"

    cache_policy_id = local.disabled_cache
    #cache_policy_id = "658327ea-f89d-4fab-a63d-7e88639e58f6"
  }

  price_class = "PriceClass_100"

    default_root_object = "index.html"

  restrictions {
    geo_restriction {
      restriction_type = "none"
      locations        = []
    }
  }
}

resource "aws_cloudfront_origin_access_control" "website" {
  name                              = "website"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_s3_bucket_policy" "cloudfront_access" {
  bucket = var.bucket_id
  policy = data.aws_iam_policy_document.cloudfront_access.json
}

data "aws_iam_policy_document" "cloudfront_access" {
  statement {
    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    actions = [
      "s3:GetObject",
    ]

    resources = [
      "${var.bucket_arn}",
      "${var.bucket_arn}/*"
    ]

    
    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"

      values = [
        aws_cloudfront_distribution.s3_distribution.arn
      ]
    }
  }
}

output "domain_name" {
    value = aws_cloudfront_distribution.s3_distribution.domain_name
}
