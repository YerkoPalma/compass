workflow "Release workflow" {
  on = "push"
  resolves = ["build"]
}

action "build" {
  uses = "./build"
  secrets = ["GH_PAT"]
}
