import crypto from 'crypto';

export const generateRandomString = (length) => {
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex')
            .slice(0,length);
}

export const generateSha512 = (text, salt) => {
    const hash = crypto.createHmac('sha512', salt);
    hash.update(text);
    const textHash = hash.digest('hex');
    return textHash;
};