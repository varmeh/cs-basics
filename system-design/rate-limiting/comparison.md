# Rate Limiting Algorithms: Pros & Cons with Examples

## **1. Fixed Window Algorithm**

**Example Recap:**

- Limits the number of requests per fixed time window (e.g., 100 requests per minute).
- Limit: 5 requests per minute.
- User sends 5 requests at 12:00:01 (allowed).
- User tries the 6th request at 12:00:30 (denied).
- At 12:01:00, the counter resets, and the user can make 5 more requests.

**Pros:**

- **Simplicity:**  
  Easy to implement. You just need a counter and a reset mechanism.
- **Low Memory Overhead:**  
  Only requires a single counter per user or IP address and no complex state tracking.

**Cons:**

- **Traffic Spikes:**  
  Vulnerable to spikes near the window boundary. A user can send 5 requests at 12:00:59 and 5 more at 12:01:01, effectively doubling their allowed rate within a short period.
- **Coarse Control:**  
  Limits are enforced only at the start of each time window, making it less accurate in managing request rates across boundaries.

**Best For:**

- **Non-critical APIs** or applications where fairness and precise rate limiting are not as important, but simplicity and low memory usage are key.
- **Used By**: Github API

---

## **2. Sliding Window Log Algorithm**

**Example Recap:**

- Keeps a log of timestamps of incoming requests and counts those within the window.
- Limit: 5 requests per minute.
- User sends requests at 12:00:00, 12:00:10, 12:00:20, 12:00:30, and 12:00:40 (all allowed).
- User tries another request at 12:00:50 (denied).
- At 12:01:10, the first request at 12:00:00 falls out of the window, allowing a new request.

**Pros:**

- **Smooth Rate Limiting:**  
  More accurate control over the rate by accounting for requests on a rolling basis, not tied to fixed window boundaries.
- **Fairer:**  
  Smoothens out traffic bursts, so a user cannot exploit window boundaries like in the fixed window approach.

**Cons:**

- **High Memory Usage:**  
  Requires storing each request’s timestamp in memory, leading to higher memory consumption, especially under heavy load.
- **Complexity:**  
  More complex to implement than fixed window due to the need for maintaining a log of timestamps and constantly purging old entries.

**Best For:**

- **High-precision rate limiting** where fairness and accuracy are critical, such as **financial systems** or **high-value APIs**.
- Highly accurate, prevents boundary spikes entirely.
- **Used By**: Google Cloud API

---

## **3. Sliding Window Counter**

**Example Recap:**

- Combines characteristics of Fixed Window and Sliding Log, counting requests in a sliding window of time (e.g., last minute).
- Limit: 5 requests per minute, divided into 6 sub-intervals (10 seconds each).
- User sends 3 requests at 12:00:01 and 2 more at 12:00:20 (allowed).
- User tries a request at 12:00:30 (denied due to reaching the limit).
- At 12:01:01, the first 3 requests fall out of the window, allowing new requests.

**Pros:**

- **Balanced Accuracy:**  
  Provides smoother rate limiting across boundaries like the sliding window log, but without the heavy memory consumption.
- **Lower Memory Usage:**  
  Uses counters instead of logging every request, reducing memory overhead compared to sliding window log.
  
**Cons:**

- **Approximation:**  
  It still doesn’t provide perfect accuracy because it’s based on counting requests in sub-intervals, which might not capture every fine-grained edge case.
- **Complexity:**  
  More complex to implement than fixed windows due to managing multiple sub-interval counters.

**Best For:**

- **Systems needing fairness with moderate accuracy,** such as **e-commerce platforms** or **online services** with mid-level traffic and fairness requirements.
- **Used By**: Twitter API

---

## **4. Token Bucket Algorithm**

**Example Recap:**

- Tokens are added to a bucket at a fixed rate. Requests consume tokens. If the bucket is empty, requests are denied.
- Limit: 5 tokens in the bucket, with 1 token replenished per second.
- User sends 5 requests at 12:00:00 (allowed, consuming all tokens).
- User tries a request at 12:00:01 (allowed as 1 token is replenished).
- User tries another request at 12:00:01 (denied, bucket is empty).

**Pros:**

- **Handles Bursts:**  
  Allows bursts of requests up to the token limit, which is useful for systems with traffic spikes.
- **Efficient:**  
  Computationally efficient, using simple arithmetic to track tokens.

**Cons:**

- **Rate Control Complexity:**  
  Needs careful tuning of the token replenishment rate and bucket size to strike the right balance between allowing bursts and enforcing limits.
- **Potential Bursts:**  
  If not tuned correctly, it can allow large bursts that may overwhelm the backend.

**Best For:**

- **Systems that allow bursty traffic** but need to enforce an overall rate limit, such as **video streaming services** or **IoT devices** that generate periodic bursts of requests.
- **Used By**: Amazon AWS, Stripe

---

## **5. Leaky Bucket Algorithm**

**Example Recap:**

- Requests are added to a queue and processed at a fixed rate. If the queue is full, requests are denied.
- Limit: 1 request per second processed, with a bucket capacity of 5.
- User sends 5 requests at 12:00:00 (1 request processed immediately, 4 stored in the bucket).
- At 12:00:01, 1 more request is processed, and 3 remain in the bucket.
- Additional requests sent while the bucket is full are denied.

**Pros:**

- **Constant Rate:**  
  Ensures a steady and controlled flow of traffic to the backend, preventing sudden spikes.
- **Simple Logic:**  
  Conceptually easy to understand and enforce a constant processing rate.

**Cons:**

- **No Bursts:**  
  Does not allow bursts of requests, which may be problematic for systems that experience periodic spikes in traffic.
- **Latency:**  
  Requests beyond the bucket’s capacity are either delayed (if using a queue) or denied, which can cause latency issues.

**Best For:**

- **Systems requiring constant and predictable processing rates**, such as **telecom networks**, **billing systems**, or **network bandwidth control**.
- **Used By**: NginX, Shopify

---

## Summary of Pros & Cons

| Algorithm             | Pros                                          | Cons                                         | Best For                                     |
|-----------------------|-----------------------------------------------|----------------------------------------------|---------------------------------------------|
| **Fixed Window**       | Simple, low memory                           | Vulnerable to spikes at boundaries           | Non-critical APIs                           |
| **Sliding Window Log** | Smooth, accurate rate limiting               | High memory usage, complex                   | High-precision rate limiting (financials)   |
| **Sliding Window Counter** | Balanced accuracy, lower memory than logs | Approximation, more complex than fixed window| E-commerce, fairness-required APIs          |
| **Token Bucket**       | Handles bursts, efficient                    | Requires tuning, potential bursts            | Bursty systems (video streaming, IoT)       |
| **Leaky Bucket**       | Constant rate, simple                        | No bursts, possible latency                  | Predictable traffic (telecom, billing)      |

Each algorithm has unique strengths and challenges. The right choice depends on the specific requirements of your system, such as whether you need to accommodate bursts, ensure fairness, or provide predictable traffic flow.
