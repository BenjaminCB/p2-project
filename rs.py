import time
import random
import sys
import reedsolo as rs

# Reed Solomon values
m = 8
n = 15
t = 2
k = n - 2 * t
runs = 25

def main():
    # Reed message from file and encode
    msg = open('data/input.txt', 'r').read().encode()
    msgs = split_str(msg, n - 2 * t)

    # Open timer file in append mode
    encode_time = open('data/encode_time_python.csv', 'a')
    decode_time = open('data/decode_time_python.csv', 'a')

    # Generate table and generater polynomial
    # prim = rs.find_prime_polys(c_exp=m, fast_primes=True, single=True)
    # rs.init_tables(c_exp=m, prim=prim)
    rs.init_tables(0x14d)
    gen = rs.rs_generator_poly_all(n)

    for i in range(runs):
        # Encode msg
        msgeccs = []
        t1 = time.perf_counter()
        for m in msgs:
            msgeccs.append(rs.rs_encode_msg(m, 2 * t, gen=gen[2 * t]))
        t2 = time.perf_counter()
        encode_time.write(str(t2 - t1) + '\n')

        # Error
        for msgecc in msgeccs:
            error_inject(msgecc)

        # Decode
        corrections = []
        t1 = time.perf_counter()
        for msgecc in msgeccs:
            corrections.append(rs.rs_correct_msg(msgecc, 2 * t))
        t2 = time.perf_counter()
        decode_time.write(str(t2 - t1) + '\n')

        rmsg = b''
        for c in corrections:
            rmsg += c[0]

        # Check result
        if (msg.decode() == rmsg.decode()):
            print("True")
        else:
            print("False")

def split_str(s, n):
    arr = []
    while len(s) > 0:
        arr.append(s[:n])
        s = s[n:]
    return arr

def error_inject(s):
    for i in range(t):
        num = random.randint(0, len(s) - 1)
        s[i] = 1

def bin2text(s):
    return "".join([chr(int(s[i:i+8],2)) for i in range(0,len(s),8)])

def bitstr_to_bytes(s):
    return bytes( int( s[i : i + 8], 2 ) for i in range(0, len(s), 8) )

def access_bit(data, num):
    base = int(num // 8)
    shift = int(num % 8)
    return (data[base] & (1<<shift)) >> shift

# def bitstr_to_bytes(s):
#     v = int(s, 2)
#     b = bytearray()
#     wwile v:
#         b.append(v & 0xff)
#         v >>= 8
#     return bytes(b[::-1])

main()
