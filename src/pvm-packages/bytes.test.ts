import assert from "node:assert";
import { test } from "node:test";
import { Bytes, BytesBlob } from "./bytes";

test("BytesBlob", async (t) => {
  await t.test("should fail if 0x is missing", () => {
    try {
      BytesBlob.parseBlob("ff2f");
      assert.fail("Should throw an exception");
    } catch (e) {
      assert.strictEqual(`${e}`, "Error: Invalid hex string: ff2f.");
    }
  });

  await t.test("parse 0x-prefixed hex string into blob of bytes", () => {
    const input = "0x2fa3f686df876995167e7c2e5d74c4c7b6e48f8068fe0e44208344d480f7904c";
    const result = BytesBlob.parseBlob(input);

    assert.deepStrictEqual(new Uint8Array(result.buffer), new Uint8Array([47, 163, 246, 134, 223, 135, 105, 149, 22, 126, 124, 46, 93, 116, 196, 199, 182, 228, 143, 128, 104, 254, 14, 68, 32, 131, 68, 212, 128, 247, 144, 76]));
  });
});

test("Bytes", async (t) => {
  await t.test("should fail in case of length mismatch", () => {
    const input = "0x9c2d3bce7aa0a5857c67a85247365d2035f7d9daec2b515e86086584ad5e8644";

    try {
      Bytes.parseBytes(input, 16);
      assert.fail("Should throw an exception");
    } catch (e) {
      assert.strictEqual(`${e}`, "Error: Input string too long. Expected 16, got 32");
    }
  });

  await t.test("parse 0x-prefixed, fixed length bytes vector", () => {
    const input = "0x9c2d3bce7aa0a5857c67a85247365d2035f7d9daec2b515e86086584ad5e8644";

    const bytes = Bytes.parseBytes(input, 32);

    assert.deepStrictEqual(new Uint8Array(bytes.view.buffer), new Uint8Array([156, 45, 59, 206, 122, 160, 165, 133, 124, 103, 168, 82, 71, 54, 93, 32, 53, 247, 217, 218, 236, 43, 81, 94, 134, 8, 101, 132, 173, 94, 134, 68]));
  });
});
