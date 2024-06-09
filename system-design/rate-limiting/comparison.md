# Rate Limiting Algos Comparison

| **Algorithm**      | **Description**                                                                                                          | **Pros**                                                                                               | **Cons**                                                                                              | **Use Cases**                                                                                          | **Companies/Products** |
|--------------------|--------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------|-------------------------|
| **Fixed Window**   | Limits the number of requests per fixed time window (e.g., 100 requests per minute).                                     | Simple to implement and understand.                                                                   | Can lead to spikes at window boundaries (e.g., 200 requests in a short period around window reset).   | Suitable for simple rate limiting needs, where exact precision is not critical.                        | GitHub API              |
| **Sliding Window** | Combines characteristics of Fixed Window and Sliding Log, counting requests in a sliding window of time (e.g., last minute). | More accurate than Fixed Window, prevents boundary spikes.                                            | More complex to implement and requires more memory for counters.                                      | Ideal for API rate limiting where a smoother distribution of requests is desired.                      | Twitter API             |
| **Token Bucket**   | Tokens are added to a bucket at a fixed rate. Requests consume tokens. If the bucket is empty, requests are denied.      | Allows for burst handling while maintaining a rate limit. Simple to implement.                        | Can lead to bursts of requests. Requires periodic token addition logic.                               | Great for handling traffic bursts (e.g., user interactions, sporadic but high-volume API calls).       | Amazon AWS<br />Stripe              |
| **Leaky Bucket**   | Requests are added to a queue and processed at a fixed rate. If the queue is full, requests are denied.                 | Smooths out bursts of traffic, ensuring a consistent request rate.                                    | Can introduce latency as requests wait in the queue. Requires queue management.                        | Effective for rate limiting where consistent processing rates are crucial (e.g., background processing).| NGINX<br />Shopify                   |
| **Sliding Log**    | Keeps a log of timestamps of incoming requests and counts those within the window.                                       | Highly accurate, prevents boundary spikes entirely.                                                   | Most memory-intensive and complex to implement.                                                       | Best for high-precision rate limiting where fairness and preventing spikes are critical.               | Google Cloud API        |

## Use Case Examples

1. **Fixed Window**:
    - **Use Case**: Simple rate limiting for public APIs where occasional spikes are tolerable.
    - **Example**: Limiting a free tier of a service to 100 requests per hour.
    - **Companies/Products**: GitHub API

2. **Sliding Window**:
    - **Use Case**: Public APIs where a more even distribution of requests is needed to avoid abuse.
    - **Example**: An e-commerce site limiting the number of product searches a user can perform to 60 per minute.
    - **Companies/Products**: Twitter API

3. **Token Bucket**:
    - **Use Case**: Systems that need to handle bursts of traffic efficiently.
    - **Example**: A chat application allowing users to send up to 5 messages per second but with a burst capacity of 20 messages.
    - **Companies/Products**: Amazon AWS

4. **Leaky Bucket**:
    - **Use Case**: Background job processing where a consistent rate of processing is required.
    - **Example**: Rate limiting emails sent by a service to 10 per second to avoid overwhelming the email server.
    - **Companies/Products**: NGINX

5. **Sliding Log**:
    - **Use Case**: High-precision rate limiting where fairness and preventing spikes are essential.
    - **Example**: Financial services API ensuring that no more than 100 transactions are processed per user per minute to prevent abuse.
    - **Companies/Products**: Google Cloud API
