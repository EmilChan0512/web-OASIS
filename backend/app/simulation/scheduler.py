from collections.abc import Sequence
import random


class RoundRobinScheduler:
    """Selects agents without consulting presentation metadata."""

    def __init__(self, agent_ids: Sequence[int], maximum_active: int, seed: int = 1):
        if maximum_active < 1:
            raise ValueError("maximum_active must be positive")
        self._agent_ids = list(agent_ids)
        self._maximum_active = maximum_active
        self._cursor = 0
        self._random = random.Random(seed)

    def select(self) -> list[int]:
        count = min(self._maximum_active, len(self._agent_ids))
        selected = [self._agent_ids[(self._cursor + offset) % len(self._agent_ids)] for offset in range(count)]
        self._cursor = (self._cursor + count) % len(self._agent_ids)
        return selected
