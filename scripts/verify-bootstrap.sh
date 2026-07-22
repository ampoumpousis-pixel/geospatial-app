#!/usr/bin/env bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

pass=0
fail=0
skip=0

check_http() {
    local name="$1"
    local url="$2"
    local expected="$3"
    echo -n "  $name ... "
    if ! command -v curl &>/dev/null; then
        echo -e "${YELLOW}SKIP (curl missing)${NC}"
        ((skip++))
        return
    fi
    local response
    response=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "$url" 2>/dev/null) || response="000"
    if [[ "$response" == "$expected" ]] || { [[ "$expected" == "2xx" ]] && [[ "$response" -ge 200 && "$response" -lt 400 ]]; }; then
        echo -e "${GREEN}OK ($response)${NC}"
        ((pass++))
    else
        echo -e "${RED}FAIL ($response, expected $expected)${NC}"
        ((fail++))
    fi
}

check_container() {
    local name="$1"
    local expected_status="$2"
    echo -n "  $name ... "
    if ! command -v docker &>/dev/null; then
        echo -e "${YELLOW}SKIP (docker missing)${NC}"
        ((skip++))
        return
    fi
    local status
    status=$(docker ps --filter "name=$name" --format "{{.Status}}" 2>/dev/null || echo "NOT FOUND")
    if echo "$status" | grep -q "$expected_status"; then
        echo -e "${GREEN}OK${NC}"
        ((pass++))
    elif echo "$status" | grep -q "healthy"; then
        echo -e "${GREEN}OK (healthy)${NC}"
        ((pass++))
    else
        echo -e "${RED}FAIL ($status)${NC}"
        ((fail++))
    fi
}

echo "═══════════════════════════════════════════════════════════"
echo "              BOOTSTRAP VERIFICATION"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Container status
echo "Docker Containers:"
check_container "docker-postgres" "Up"
check_container "docker-redis" "Up"
check_container "docker-geoserver" "Up"
check_container "docker-minio" "Up"
check_container "docker-mailhog" "Up"
check_container "docker-backend" "Up"
check_container "docker-frontend" "Up"
check_container "docker-celery" "Up"

echo ""

# HTTP endpoints
echo "HTTP Endpoints:"
check_http "GeoServer   " "http://localhost:8080/geoserver/" "2xx"
check_http "MinIO       " "http://localhost:9000/minio/health/live" "200"
check_http "Mailhog Web " "http://localhost:8025/" "2xx"
check_http "Django Admin" "http://localhost:8000/admin/login/" "200"
check_http "Vite Dev    " "http://localhost:5173/" "2xx"

echo ""
echo "───────────────────────────────────────────────────────────"
echo -e "  ${GREEN}Passed: $pass${NC}  ${RED}Failed: $fail${NC}  ${YELLOW}Skipped: $skip${NC}"
echo "───────────────────────────────────────────────────────────"

if [ "$fail" -gt 0 ]; then
    exit 1
fi
