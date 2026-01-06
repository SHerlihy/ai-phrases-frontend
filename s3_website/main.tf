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

  s3_id = module.s3.bucket_id
}

output "website_url" {
  value = module.s3.website_url
}
