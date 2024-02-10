#!/bin/bash

git add .

echo 'Enter the commit message:'

read commitMessage

git commit -m "$commitMessage"

git config push.default current

git push origin $branch

read
