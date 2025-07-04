export default {
    c: {
        image: "sandbox-c",
        ext: "c",
        cmd: (file: string) => `gcc /app/${file} -o /app/a.out && /app/a.out`,
    },
    cpp: {
        image: "sandbox-cpp",
        ext: "cpp",
        cmd: (file: string) => `g++ /app/${file} -o /app/a.out && /app/a.out`,
    },
    java: {
        image: "sandbox-java",
        ext: "java",
        cmd: (file: string) => `javac /app/${file} && java -cp /app Main`,
    },
    python: {
        image: "sandbox-python",
        ext: "py",
        cmd: (file: string) => `python /app/${file}`,
    },
    javascript: {
        image: "sandbox-javascript",
        ext: "js",
        cmd: (file: string) => `node /app/${file}`,
    },
    typescript: {
        image: "sandbox-typescript",
        ext: "ts",
        cmd: (file: string) => `tsc /app/${file} && node /app/${file.replace(/\.ts$/, '.js')}`,
    },
    go: {
        image: "sandbox-golang",
        ext: "go",
        cmd: (file: string) => `go run /app/${file}`,
    },
    rust: {
        image: "sandbox-rust",
        ext: "rs",
        cmd: (file: string) => `rustc /app/${file} -o /app/a.out && /app/a.out`,
    },
};
