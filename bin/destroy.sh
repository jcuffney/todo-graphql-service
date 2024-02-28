ENV=dev

aws cloudformation delete-stack \
    --stack-name "todo-$ENV-graphql" \
    --wait