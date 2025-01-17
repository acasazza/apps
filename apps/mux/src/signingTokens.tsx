import * as jwt from 'jsonwebtoken';

const getPrivateKey = (key: string) => Buffer.from(key, 'base64');

const sign = (playbackId: string, signingKeyId: string, signingKeyPrivate: string, aud: string) =>
  jwt.sign({}, getPrivateKey(signingKeyPrivate), {
    algorithm: 'RS256',
    keyid: signingKeyId,
    audience: aud,
    subject: playbackId,
    noTimestamp: true,
    expiresIn: '12h',
  });

export const createSignedPlaybackUrl = (
  playbackId: string,
  signingKeyId: string,
  signingKeyPrivate: string,
  muxDomain: string
) => {
  const domain = muxDomain ? muxDomain : 'mux.com';
  const token = sign(playbackId, signingKeyId, signingKeyPrivate, 'v');
  return `https://stream.${domain}/${playbackId}.m3u8?token=${token}`;
};

export const createSignedThumbnailUrl = (
  playbackId: string,
  signingKeyId: string,
  signingKeyPrivate: string,
  muxDomain: string
) => {
  const domain = muxDomain ? muxDomain : 'mux.com';
  const token = sign(playbackId, signingKeyId, signingKeyPrivate, 't');
  return `https://image.${domain}/${playbackId}/thumbnail.jpg?token=${token}`;
};
