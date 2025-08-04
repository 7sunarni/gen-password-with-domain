import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import fs from 'fs/promises';

const dynamo = DynamoDBDocument.from(new DynamoDB());
const tableName = "pswd-cfg";
const statusOK = '200';
const statusBadRequest = '400';
const statusInternalServerError = '500';
const headers = {
    'Content-Type': 'text/plain',
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};


export const handler = async (event, context) => {
    console.log(event);

    if (!event ||
        !event.requestContext ||
        !event.requestContext.http ||
        !event.requestContext.http.method ||
        !event.requestContext.http.path
    ) {
        return {
            statusCode: statusBadRequest,
            headers,
            body: "",
        }
    }

    if (event.requestContext.http.path === "/") {
        return staticFile(event, "index.html", "text/html")
    }
    if (event.requestContext.http.path === "/index.js") {
        return staticFile(event, "index.js_template", "text/plain; charset=utf-8")
    }
    if (event.requestContext.http.path === "/manifest.json") {
        return staticFile(event, "manifest.json", "text/plain; charset=utf-8")
    }
    if (event.requestContext.http.path === "/api") {
        return api(event)
    }
};

async function setConfig(event) {
    let body = '';
    let httpBody = JSON.parse(event.body)
    let msg = {
        TableName: tableName,
        Item: {
            host: httpBody.host,
            alias: httpBody.alias,
            "length": httpBody.length,
            "ll": httpBody.ll,
            "number": httpBody.number,
            "s1": httpBody.s1,
            "s2": httpBody.s2,
            "ul": httpBody.ul,
            "date": httpBody.date
        },
    }
    try {
        await dynamo.put(msg);
        body = "success"
    } catch (err) {
        body = "failed: " + err.message;
    } finally {

    }
    return {
        statusCode: statusOK,
        headers,
        body: body,
    }
}

async function getConfig(event) {
    let statusCode = statusOK;
    let query = event.queryStringParameters;
    let body = "";
    let queryAlias = query.alias;

    let params = {
        TableName: tableName,
        FilterExpression: "alias = :alias",
        ExpressionAttributeValues: {
            ":alias": queryAlias,
        }
    }

    try {
        let scanned = await dynamo.scan(params);
        scanned.Items.sort((a, b) => b.ts - a.ts);
        body = scanned.Items;
    } catch (err) {
        statusCode = statusInternalServerError;
        body = "failed: " + err.message;
    } finally {

    }
    return {
        statusCode,
        body,
        headers,
    };

}

async function api(event) {
    if (event.requestContext.http.method === "POST") {
        return setConfig(event)
    }

    if (event.requestContext.http.method === "GET") {
        return getConfig(event)
    }
}


async function staticFile(event, fileName, contentType) {
    let htmlHeaders = headers;
    htmlHeaders['Content-Type'] = contentType;
    let data = await fs.readFile(fileName);
    console.log('data', data.toString('utf-8'))

    return {
        statusCode: statusOK,
        headers,
        body: data.toString('utf-8'),
    }
}
