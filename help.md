# MR.S


## create workspace
- `ng new audio-player --create-application=false`

## add library
- `ng g lib ngx-audio-control`

## add demo

- `ng g application demo`


## publish to npm 
- npm run publish-ngx-audio-control
- `ng build ngx-audio-control --configuration production && cd dist/ngx-audio-control && npm publish --access=public`