# pptr.io

a free and open-source api that runs [puppeteer](https://developers.google.com/web/tools/puppeteer) as a service — powered by [vercel](https://vercel.com/).

# table of contents

- [usage](#usage)
    - [endpoints](#endpoints)
        1. [screenshot](#screenshot)
        2. [metrics](#metrics)
- [contributing](#contributing)
- [credits](#credits)
- [license](#license)

# usage

- base url: `https://pptr.io/`
- default path: `api/`
- endpoint: any one of the individual `.js` files in the [api](/api) folder
    - ignore the `index.js` file inside the `api` folder

## endpoints

### screenshot
[source](/api/screenshot.js)

makes use of the [page.screenshot](https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#pagescreenshotoptions) method to take a screenshot of the page.

![GET Request](https://img.shields.io/badge/REQUEST-GET-GREEN) `https://pptr.io/api/screenshot?url=https://google.com/`

<details>
<summary>sample output of the screenshot endpoint</summary>

![screenshot](https://pptr.io/api/screenshot?url=https://google.com/)

</details>

### metrics
[source](/api/metrics.js)

makes use of the [page.metrics](https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#pagemetrics) method to fetch metrics of the page.

![GET Request](https://img.shields.io/badge/REQUEST-GET-GREEN) `https://pptr.io/api/metrics?url=https://google.com/`

<details>
<summary>sample output of the metrics endpoint</summary>

```json
{
    "Timestamp": 2469.885878,
    "Documents": 5,
    "Frames": 2,
    "JSEventListeners": 150,
    "Nodes": 391,
    "LayoutCount": 4,
    "RecalcStyleCount": 9,
    "LayoutDuration": 0.038393,
    "RecalcStyleDuration": 0.018054,
    "ScriptDuration": 0.316212,
    "TaskDuration": 0.745999,
    "JSHeapUsedSize": 8158228,
    "JSHeapTotalSize": 10993664
}
```

</details>

# contributing

## create new endpoints

## update exsting services

## improve homepage


# Credits

0. if it weren't for jarrod overson's [videos](https://www.youtube.com/channel/UCJbZGfomrHtwpdjrARoMVaA/search?query=Puppeteer), i might've probably not gotten the courage to start working with puppeteer.
1. props to the original idea via [pptraas.com](https://github.com/GoogleChromeLabs/pptraas.com) — although, i like my current domain name just the same ;)
2. huge thanks to [Salma | @whitep4nth3r](https://twitter.com/whitep4nth3r) for sharing insights on the [puppeteer <> vercel](https://www.contentful.com/blog/2021/03/17/puppeteer-node-open-graph-screenshot-for-socials/) blog post.

# license

MIT License

Copyright (c) 2021 Sourabh Choraria

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
