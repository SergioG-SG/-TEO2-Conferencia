// Credenciales para el acceso a AWS

let aws_keys = {
    s3: {
        region: 'us-east-2',
        accessKeyId: 'acceddKeyId',
        secretAccessKey: 'secretAccessKey'
    },
    rekognition: {
        region: 'us-east-2',
        accessKeyId: 'acceddKeyId',
        secretAccessKey: 'secretAccessKey'
    }
}

module.exports = aws_keys