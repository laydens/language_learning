from django.db import models

class MemoryHooks(models.Model):
    id = models.IntegerField(primary_key=True)
    entity_id = models.IntegerField()
    entity_type = models.CharField(max_length=1)
    hook = models.CharField(max_length=200, null=True, blank=True)
    category = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        db_table = 'memory_hooks'  # Ensure it matches the existing table name
        managed = False  # If the table is managed externally

    def __str__(self):
        return f"Memory Hook for {self.entity_id} ({self.entity_type})" 