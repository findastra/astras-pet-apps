# Astra Pet Registry
Community submission catalog for Astra's Pet Apps. This is a starter repository, not yet published to GitHub.

## Submit a pet
Use the **Submit a Pet** GitHub issue form. Maintainers review the repository, license, manifest, releases, compatibility, permissions, and security before listing it in `catalog/`.

## Release contract
Each pet repository must provide `pet.json` with `pet_id`, `name`, `version`, `framework`, `repository`, `license`, `supported_hosts`, and `capabilities`. Version follows SemVer; published GitHub release tag must be `v<version>`. README must display the current release and compatibility. Registry records are separate from installed versions.

## Goldfish responsibilities
Poll or receive authenticated GitHub release webhooks; compare each installed version with upstream release and framework compatibility; report unknown/stale states; request approval before installing updates. Never execute unreviewed third-party code automatically. Use pinned release assets/checksums and rollback.

## Create on GitHub
Create a new repository named `astra-pet-registry` under your chosen owner and push this starter. Then configure issue forms, review policies, CI, and a link from The Farm website to GitHub's new-issue form. GitHub Goldfish should use the registry catalog as discovery input.
