import { GraphQLScalarType, Kind } from 'graphql';

export default new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    description: 'ISO 8601 Date string',
    serialize(value) {
        // Convert outgoing Date to ISO 8601 string for JSON serialization
        return value.toISOString();
    },
    parseValue(value) {
        // Convert incoming ISO 8601 string from variables
        return new Date(value);
    },
    parseLiteral(ast) {
        // Convert incoming ISO 8601 string from inline literals
        if (ast.kind === Kind.STRING) {
            return new Date(ast.value);
        }
        return null;
    },
});