import { GraphQLScalarType, GraphQLError, Kind } from 'graphql';

const ISO_REGEX = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)((-(\d{2}):(\d{2})|Z)?)$/

export default new GraphQLScalarType({
    name: 'Date',
    description: 'A date string in ISO 8601 format (YYYY-MM-DD)',

    serialize(value) {
        // Ensure the value is a valid ISO date string
        if (!ISO_REGEX.test(value)) {
            throw new GraphQLError('Invalid ISO date format.');
        }
        return value; // Return the date in YYYY-MM-DD format
    },

    parseValue(value) {
        // Validate the ISO date format
        if (!ISO_REGEX.test(value)) {
            throw new GraphQLError('Invalid ISO date format.');
        }
        return value;
    },

    parseLiteral(ast) {
        // Ensure the AST value is a valid ISO date string
        if (ast.kind !== Kind.STRING || !ISO_REGEX.test(ast.value)) {
            throw new GraphQLError('Invalid ISO date format.');
        }
        return ast.value;
    },
});