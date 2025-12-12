FROM alpine:3.19

# Install Python and dependencies
RUN apk add --no-cache python3 py3-pip

# Create app directory
WORKDIR /app

# Copy exporter script
COPY exporter.py /app/

# Expose Prometheus metrics port
EXPOSE 9154

# Run the exporter
CMD ["python3", "/app/exporter.py"]
