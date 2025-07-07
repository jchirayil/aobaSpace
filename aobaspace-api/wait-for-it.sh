#!/usr/bin/env bash
set -ex

# wait-for-it.sh

# Original source: https://github.com/vishnubob/wait-for-it

# Usage: ./wait-for-it.sh host:port [-t timeout] [-- command args]
# Waits for host:port to be available.

# Default timeout in seconds
TIMEOUT=15
QUIET=0
TARGET_HOST= # Changed from HOST
TARGET_PORT= # Changed from PORT
CMD=

# Explicitly get DB credentials from environment variables
DB_USER=${POSTGRES_USER:-user}
DB_NAME=${POSTGRES_DB:-aobaspace_db}
DB_PASSWORD=${POSTGRES_PASSWORD} # Get password from environment

echoerr() {
  if [ "$QUIET" -ne 1 ]; then printf "%s\n" "$*" 1>&2; fi
}

usage() {
  cat << USAGE >&2
Usage:
  $0 host:port [-t timeout] [-- command args]
  -h | --help       Show this message
  -q | --quiet      Don't output any status messages
  -t | --timeout    Timeout in seconds, zero for no timeout (default: $TIMEOUT)
  --                Execute command after the test finishes
USAGE
  exit 1
}

wait_for() {
  echoerr "Waiting for $TARGET_HOST:$TARGET_PORT (database $DB_NAME, user $DB_USER) to be available..."
  echoerr "Checking POSTGRES_PASSWORD length: ${#DB_PASSWORD}" # Debug print for password length (masked)

  for i in $(seq $TIMEOUT); do
    if [ "$TARGET_PORT" -gt 0 ]; then
      # Use pg_isready to check if the PostgreSQL database is ready
      # -h host, -p port, -U user, -d database, -t timeout (1 second for each check)
      # Set PGPASSWORD directly for pg_isready
      PGPASSWORD="$DB_PASSWORD" pg_isready -h "$TARGET_HOST" -p "$TARGET_PORT" -U "$DB_USER" -d "$DB_NAME" -t 1 > /dev/null 2>&1
      result=$?
    else
      # Fallback to ping if no port (less common for databases, but kept for completeness)
      ping -c 1 "$TARGET_HOST" > /dev/null 2>&1
      result=$?
    fi

    if [ $result -eq 0 ]; then
      echoerr "$TARGET_HOST:$TARGET_PORT (database $DB_NAME) is available after $i seconds"
      return 0
    fi
    echoerr "Attempt $i/$TIMEOUT: $TARGET_HOST:$TARGET_PORT (database $DB_NAME) is not yet available. Sleeping 1 second."
    sleep 1
  done
  echoerr "Timeout occurred after $TIMEOUT seconds waiting for $TARGET_HOST:$TARGET_PORT (database $DB_NAME)"
  return 1
}

# Process arguments
while [ $# -gt 0 ]; do
  case "$1" in
    *:*)
      TARGET_HOST=$(printf "%s\n" "$1"| cut -d : -f 1) # Changed to TARGET_HOST
      TARGET_PORT=$(printf "%s\n" "$1"| cut -d : -f 2) # Changed to TARGET_PORT
      shift 1
      ;;
    -h | --help)
      usage
      ;;
    -q | --quiet)
      QUIET=1
      shift 1
      ;;
    -t | --timeout)
      TIMEOUT="$2"
      if [ "$TIMEOUT" -le 0 ]; then
        TIMEOUT=0 # No timeout
      fi
      shift 2
      ;;
    --)
      shift
      CMD="$@"
      break
      ;;
    *)
      echoerr "Unknown argument: $1"
      usage
      ;;
  esac
done

if [ -z "$TARGET_HOST" ]; then # Changed to TARGET_HOST
  echoerr "Error: host:port argument is required."
  usage
fi

if wait_for; then
  echoerr "Database is ready. Adding a small delay before starting the application..."
  sleep 2
  if [ -n "$CMD" ]; then
    echoerr "Executing command: $CMD"
    exec $CMD
  fi
else
  exit 1
fi