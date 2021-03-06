#from django.http import HttpResponse
from django.shortcuts import render

def _index(request):
    context = {}
    return render(request, 'index.html', context)

def _flowsim(request):
    context = {}
    return render(request, 'flowsim.html', context)
    
def _flowmech(request):
    context = {}
    return render(request, 'flowmech.html', context)
    
def _flowexp(request):
    context = {}
    return render(request, 'flowexp.html', context)
    
def _aboutus(request):
    context = {}
    return render(request, 'aboutus.html', context)
    
def _contactus(request):
    context = {}
    return render(request, 'contactus.html', context)

def _authentication(request):
    context = {}
    context['hidefoot']=True;
    return render(request, 'authentication.html', context)

def _register(request):
    context = {}
    context['hidefoot']=True;
    return render(request, 'register.html', context)
