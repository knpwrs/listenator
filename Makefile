SHELL := /bin/bash

.PHONY: init init-githooks

init: init-githooks

init-githooks:
	shopt -s extglob; \
	ROOT=$$(pwd); \
	for hook in $$ROOT/.githooks/*; do \
	  [ -f "$$hook" ] && ln -fsv $$hook $$ROOT/.git/hooks$${hook#$$ROOT/.githooks}; \
	done
