"""Quick test to verify visualization fix"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from main import extract_location_and_year, normalize

# Test cases
test_cases = [
    ("Plot graph for West Bengal", "WEST BENGAL", "WEST BENGAL"),
    ("Show trend for Delhi 2024", "DELHI", "DELHI"),
    ("Category bar for Rohini 2024", "ROHINI", "DELHI"),
]

print("=" * 70)
print("Testing Location vs State Logic")
print("=" * 70)

for query, expected_loc, expected_state in test_cases:
    print(f"\nQuery: {query}")
    loc, state, year, _ = extract_location_and_year(query)

    # Check if location equals state
    location_param = None if (loc and normalize(loc) == normalize(state)) else loc

    print(f"  Extracted Location: {loc}")
    print(f"  Extracted State: {state}")
    print(f"  Location Param (for viz): {location_param}")
    print(f"  Result: {'OK - Will show ALL locations' if location_param is None else f'OK - Will filter to {location_param}'}")

    # Verify
    assert loc == expected_loc, f"Location mismatch: {loc} != {expected_loc}"
    assert state == expected_state, f"State mismatch: {state} != {expected_state}"

print("\n" + "=" * 70)
print("All tests passed! OK")
print("=" * 70)
