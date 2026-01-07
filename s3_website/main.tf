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

output "website_endpoint" {
  value = module.s3.website_endpoint
}
