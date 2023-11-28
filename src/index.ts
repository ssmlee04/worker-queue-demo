/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
  MY_QUEUE_EDGAR: Queue
  MY_QUEUE_EDGAR_DLQ: Queue
}

export default {
  async queue (batch: MessageBatch<Error>, env: Env): Promise<void> {
  	console.log(batch.queue)
    switch (batch.queue) {
      case 'queue-demo-dlq':
        for (const msg of batch.messages) {
          console.log('Received dlq msg:');
          console.log(msg.body)

          if (msg.body.type === 'edgar_parse') {
            	    const ticker = msg.body.msg.ticker
              const skip = msg.body.msg.skip ? parseInt(msg.body.msg.skip) : 0
              const limit = msg.body.msg.limit ? parseInt(msg.body.msg.limit) : 20

            	if (Math.random() < 0.3) {
	            	console.log('totally dead')
            	}
            	else if (skip < 200) {
            		console.log('sending it back.')
	            	await env.MY_QUEUE_EDGAR.send({
	                  type: 'edgar_parse',
	                  msg: {
	                    ticker,
	                    skip: skip + limit,
	                    limit
	                  }
	                }, {
	                  contentType: 'json'
	                })
            	}
            } 

          // msg.ack()
        }
        break
      case 'queue-demo':
        for (const msg of batch.messages) {
          console.log('Received good msgs:');
          console.log(msg.body)

            if (msg.body.type === 'edgar_parse') {
            	    const ticker = msg.body.msg.ticker
              const skip = msg.body.msg.skip ? parseInt(msg.body.msg.skip) : 0
              const limit = msg.body.msg.limit ? parseInt(msg.body.msg.limit) : 20

            	if (Math.random() < 0.2) {
	            	await env.MY_QUEUE_EDGAR_DLQ.send({
	                  type: 'edgar_parse',
	                  msg: {
	                    ticker,
	                    forDLQ: 1,
	                    skip: skip + limit,
	                    limit
	                  }
	                }, {
	                  contentType: 'json'
	                })
            	}
            	else if (skip < 200) {
	            	await env.MY_QUEUE_EDGAR.send({
	                  type: 'edgar_parse',
	                  msg: {
	                    ticker,
	                    skip: skip + limit,
	                    limit
	                  }
	                }, {
	                  contentType: 'json'
	                })
            	}
            } 
          
          // msg.ack()
        }
        break
      default:
    }
  },

  async fetch (request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const { pathname: path } = new URL(request.url)

    if (request.method === 'GET') {
        return new Response(null, {})
    }

    return new Response('Hello World!!')
  }
}
