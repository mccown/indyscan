terraform {
  required_version = "~> 0.11.8"
}

provider "null" {
  version = "~> 2.1"
}

provider "aws" {
  version = "~> 1.40.0"
  region = "${var.region}"
  profile = "${var.profile}"
}
