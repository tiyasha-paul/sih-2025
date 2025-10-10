"""Quick test script to verify location/state extraction works correctly"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from main import extract_location_and_year

# Test queries
test_queries = [
    "Plot graph for West Bengal",
    "Show trend for Delhi 2024",
    "Category bar for Rohini 2024",
    "Generate visualization for Odisha 2023",
    "Display trend for Haryana",
    "Graph for West Bengal 2024",
    "Show category bar for Delhi Civil Lines 2024",
]

print("=" * 60)
print("Testing Location/State Extraction")
print("=" * 60)

for query in test_queries:
    print(f"\nQuery: {query}")
    print("-" * 60)
    location, state, year, query_type = extract_location_and_year(query)
    print(f"Result:")
    print(f"   Location: {location}")
    print(f"   State: {state}")
    print(f"   Year: {year}")
    print(f"   Type: {query_type}")
    print("-" * 60)

print("\n" + "=" * 60)
print("Test Complete!")
print("=" * 60)
