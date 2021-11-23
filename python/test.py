def isPrime(n):
    for i in range(2,n):
        if n%i==0:
            return False
    return True
    
num = int(input())
for i in range(2,num+1):
    if isPrime(i):
        print(i,end=' ')