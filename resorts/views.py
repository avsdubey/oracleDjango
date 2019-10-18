from django.shortcuts import render
from resorts.models import Resort
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.db import connection

# Create your views here.
def  list_resorts (request):
    return render(request,'list_resorts.html',{'resorts' : Resort.objects.all()})

@csrf_exempt    
def  add_resorts (request):
    # NOTE: "request.form" data exists only in a POST request
    resort_id = request.POST['p_resort_id']
    resort_desc = request.POST['p_resort_desc']
    active = request.POST['p_active_input']
    transfer_reversal = request.POST['p_transfer_reversal']
    new_rest = Resort(resort_id=resort_id, resort_desc=resort_desc, active=active, transfer_reversal=transfer_reversal)
    new_rest.save()
    return HttpResponse('Insert succesfully')
  
@csrf_exempt   
def  upd_resorts (request):
    # NOTE: "request.form" data exists only in a POST request
    resort_id = request.POST['p_resort_id']
    resort_desc = request.POST['p_resort_desc']
    active = request.POST['p_active_input']
    transfer_reversal = request.POST['p_transfer_reversal']
    cursor = connection.cursor()
    kwArgs = dict(p_resort_id = resort_id,
                  p_resort_desc = resort_desc,
                  p_active=active,
                  p_transfer_reversal=transfer_reversal,
                  p_action='upd')
    cursor.callproc("cm_resorts_mgmt_pkg.add_upd_new_resort", [], kwArgs)
    return HttpResponse('Update succesfully')



