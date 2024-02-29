ENV=dev

aws cloudformation deploy \
    --stack-name "todo-$ENV-graphql" \
    --template-file ./infra/template.yml \
    --parameter-overrides Environment="$ENV"    
