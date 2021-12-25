a=input()
for i in range(len(a)):
    if a[i]>="A" and a[i]<='Z':
        if ord(a[i])+5>ord("Z"):
            print(chr(ord(a[i])+5-ord("Z")+ord("A")-1),end="")
        else:
            print(chr(ord(a[i])+5),end="")
    elif a[i]>="a" and a[i]<="z":
        if ord(a[i])+3>ord("z"):
            print(chr(ord(a[i])+3-ord("z")+ord("a")-1),end="")
        else:
            print(chr(ord(a[i])+3),end="")
    else:
        print(a[i],end="")