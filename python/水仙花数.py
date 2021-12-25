result = []
for i in range(100,1000):
    s=str(i)
    a=pow(int(s[0]),3)
    b=pow(int(s[1]),3)
    c=pow(int(s[2]),3)
    if (a+b+c==i):
        result.append(i)
print(*result,sep=', ')