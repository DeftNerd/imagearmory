all: deps

deps:
	@echo "--> Restoring dependencies"
	@go get github.com/tools/godep
	@godep restore