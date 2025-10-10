# New backend helper: parse simple queries and return water statistics per state/year.
# This file should be imported and used by the existing query handler where appropriate.
import re

# Example data. Add entries for every state/place you need using the same structure.
STATE_DATA = {
    "seelampur": {
        2024: {
            "rainfall_mm": 652.0,
            "annual_extractable_ground_water_resources_ham": 730.44,
            "ground_water_extraction_ham": 628.54,
        }
    },
    # ... add other states/places here in the same shape ...
}


def get_state_water_stats(state_name, year=None):
    """Return the water stats dict for a given state_name and year.

    If the exact year is not present, returns None values for the three keys.
    """
    if not state_name:
        return {
            "rainfall_mm": None,
            "annual_extractable_ground_water_resources_ham": None,
            "ground_water_extraction_ham": None,
        }
    key = state_name.strip().lower()
    entry = STATE_DATA.get(key, {})
    if year is None:
        # if no year provided, try to return the latest available year for the state
        if not entry:
            return {"rainfall_mm": None, "annual_extractable_ground_water_resources_ham": None, "ground_water_extraction_ham": None}
        latest_year = max(entry.keys())
        return entry[latest_year]
    return entry.get(year, {"rainfall_mm": None, "annual_extractable_ground_water_resources_ham": None, "ground_water_extraction_ham": None})


def parse_query_and_get_response(query_text):
    """Parse queries like "rain fall in seelampur in 2024" and return the stats dict.

    Returns a dict with keys: rainfall_mm, annual_extractable_ground_water_resources_ham, ground_water_extraction_ham
    or None if parsing fails.
    """
    if not query_text:
        return None

    # try to find a 4-digit year
    year_match = re.search(r"\b(20\d{2}|19\d{2})\b", query_text)
    year = int(year_match.group(0)) if year_match else None

    # try to extract place after 'rain', 'rainfall' or 'rain fall'
    place_match = re.search(r"rain\s?fall in ([\w\s-]+?)(?: in \d{4}|$)", query_text, re.IGNORECASE)
    if not place_match:
        # fallback: 'in <place> in <year>'
        place_match = re.search(r"in ([\w\s-]+?) in (?:20\d{2}|19\d{2})", query_text, re.IGNORECASE)
    place = place_match.group(1).strip() if place_match else None

    if not place:
        return None

    return get_state_water_stats(place, year)
