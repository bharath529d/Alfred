import icmplib

try:
    result = icmplib.ping("www.vulnhub.com",count=1,interval=0,timeout=2)
    if result.is_alive:
        print("Alive")
except icmplib.exceptions.NameLookupError:
    print("Not Alive")
