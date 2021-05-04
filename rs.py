import time
import random
import reedsolo as rs

# Reed Solomon values
m = 8
n = 255
t = 8
k = n - 2 * t
runs = 25

def main():
    # Reed message from file and encode
    msg = open('data/input.txt', 'r').read().encode()

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
        t1 = time.perf_counter()
        msgecc = rs.rs_encode_msg(msg, 2 * t, gen=gen[2 * t])
        t2 = time.perf_counter()
        encode_time.write(str(t2 - t1) + '\n')

        # Error
        error_inject(msgecc)

        # Decode
        t1 = time.perf_counter()
        rmsg, recc, err_pos = rs.rs_correct_msg(msgecc, 2 * t)
        t2 = time.perf_counter()
        decode_time.write(str(t2 - t1) + '\n')

        # Check result
        print(msg.decode())
        print(rmsg.decode())

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
