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

module "s3" {
  source = "./create_s3"
}

module "upload" {
  source = "./upload"

  bucket_id = module.s3.bucket_id
}

module "cdn" {
  source = "./cdn"

  bucket_arn = module.s3.bucket_arn
  bucket_id = module.s3.bucket_id
  bucket_regional_domain_name = module.s3.bucket_regional_domain_name
}

# output "website_endpoint" {
#   value = module.s3.website_endpoint
# }

output "cdn_endpoint" {
  value = module.cdn.domain_name
}
