ENV=dev

aws cloudformation deploy \
    --stack-name "todo-$ENV-graphql" \
    --template-file ./infra/template.yaml \
    --parameter-overrides Environment="$ENV"    