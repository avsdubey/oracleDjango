from django.db import models

# Create your models here.
class Resort(models.Model):
    resort_id = models.CharField(max_length=25,primary_key=True)
    resort_desc = models.CharField(max_length=25, null = True)
    transfer_reversal =  models.CharField(max_length=3, null = True)
    active = models.CharField(max_length=3, null = True)
    class Meta:
         db_table = "Resorts"
         
class add_resorts():
      def concidac(self, pv_fecha):
          cursor = connection.cursor()
          spdac = cursor.callproc("cm_resorts_mgmt_pkg.add_upd_new_resort",(pv_fecha))
          cursor.close()
          return spdac