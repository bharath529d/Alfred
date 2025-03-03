from Wappalyzer import Wappalyzer, WebPage
w = Wappalyzer.latest()
p = WebPage.new_from_url("https://rkmvc.ac.in")
result = w.analyze(p)
print(result)