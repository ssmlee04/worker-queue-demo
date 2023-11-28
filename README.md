
I can keep sending 

```json
{"type":"edgar_parse","msg":{"ticker":"NET","skip":0}}
```

to the `queue-demo`. The expectation is sometimes it will dead letter the message to the DLQ and DLQ will be able to process it and send it back. 

What I noticed is after a while it seems this queue will not be able to receive messages anymore, according to `wrangler tail`.

![https://i.stack.imgur.com/4z9G5.png](https://i.stack.imgur.com/4z9G5.png)