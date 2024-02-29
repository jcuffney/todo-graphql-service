ENV=dev

# delete the stack if it exists
aws cloudformation delete-stack \
    --stack-name "todo-$ENV-graphql"

# wait for the stack to be deleted
aws cloudformation wait stack-delete-complete \
    --stack-name "todo-$ENV-graphql"

# (re)create the stack
aws cloudformation deploy \
    --stack-name "todo-$ENV-graphql" \
    --template-file ./infra/template.yml \
    --parameter-overrides Environment="$ENV"    

# seed the databases
./bin/seed.sh

# start the dev server
npm run dev