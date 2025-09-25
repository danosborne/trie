/**
 * datastructures-js/trie
 * @copyright 2020 Eyas Ranjous <eyas.ranjous@gmail.com>
 * @license MIT
 */

const { TrieNode } = require('./trieNode');

/**
 * @class Trie
 */
class Trie {
  constructor() {
    this._root = new TrieNode('');
    this._wordsCount = 0;
    this._nodesCount = 1; // root node
  }

  /**
   * Inserts a word into the trie
   * @public
   * @param {any} value
   * @returns {Trie}
   */
  insert(value) {
    if (value === undefined || value === null) {
      return this;
    }

    const word = value.toString();
    let currentNode = this._root;
    for (let i = 0; i < word.length; i += 1) {
      if (!currentNode.hasChild(word[i])) {
        currentNode.addChild(word[i]);
        this._nodesCount += 1;
      }
      currentNode = currentNode.getChild(word[i]);
    }

    if (!currentNode.isEndOfWord()) {
      currentNode.setEndOfWord(true);
      this._wordsCount += 1;
    }

    return this;
  }

  /**
   * Checks if a word exists in the trie
   * @public
   * @param {any} value
   * @returns {boolean}
   */
  has(value) {
    if (value === undefined || value === null) {
      return false;
    }

    const word = value.toString();
    let currentNode = this._root;
    for (let i = 0; i < word.length; i += 1) {
      if (!currentNode.hasChild(word[i])) {
        return false;
      }
      currentNode = currentNode.getChild(word[i]);
    }

    if (!currentNode.isEndOfWord()) {
      return false;
    }

    return true;
  }

  /**
   * Finds a word in the trie and returns its last char node
   * @public
   * @param {any} value
   * @returns {TrieNode}
   */
  find(value) {
    if (value === undefined || value === null) {
      return null;
    }

    const word = value.toString();
    let currentNode = this._root;

    for (let i = 0; i < word.length; i += 1) {
      if (!currentNode.hasChild(word[i])) {
        return null;
      }
      currentNode = currentNode.getChild(word[i]);
    }

    if (!currentNode.isEndOfWord()) {
      return null;
    }

    return currentNode;
  }

  /**
   * Removes a word from the trie
   * @public
   * @param {string} word
   * @returns {string | null}
   */
  remove(value) {
    if (value === undefined || value === null) {
      return null;
    }

    const word = value.toString();
    let currentNode = this._root;

    for (let i = 0; i < word.length; i += 1) {
      if (!currentNode.hasChild(word[i])) {
        return null;
      }
      currentNode = currentNode.getChild(word[i]);
    }

    if (!currentNode.isEndOfWord()) {
      return null;
    }

    if (currentNode.childrenCount() > 0 || word === '') {
      currentNode.setEndOfWord(false);
      this._wordsCount -= 1;
      return word;
    }

    do {
      currentNode.getParent().removeChild(currentNode.getChar());
      this._nodesCount -= 1;
      currentNode = currentNode.getParent();
    } while (
      currentNode.isLeaf()
      && !currentNode.isEndOfWord()
      && !currentNode.isRoot()
    );

    this._wordsCount -= 1;
    return word;
  }

  /**
   * Traverse the trie and pass words to a callback
   * @public
   * @param {function} cb
   */
  forEach(cb) {
    if (typeof cb !== 'function') {
      throw new Error('Trie.forEach expects a callback function');
    }

    const forEachRecursive = (node = this._root, word = '') => {
      if (node.isEndOfWord()) {
        cb(word);
      }

      node.children().forEach((child) => {
        forEachRecursive(child, word + child.getChar());
      });
    };

    return forEachRecursive();
  }

  /**
   * Traverse the tree and pass prefixes and words to separate callbacksFor each is really 'for each word'.
   * @public
   * @param {function} prefixCb
   * @param {function} wordCb
   */
  forEachPrefixAndWord(prefixCb, wordCb) {
    if (typeof prefixCb !== 'function') {
      throw new Error('Trie.forEachPrefixAndWord expects a preifx callback function');
    }
    if (typeof wordCb !== 'function') {
      throw new Error('Trie.forEach expects a word callback function');
    }

    const forEachRecursive = (node = this._root, prefix = '', word = '') => {
      if (node.children().size > 1) {
        prefixCb(prefix);
        prefix = '';
      }
      if (node.isEndOfWord()) {
        wordCb(word);
      }

      node.children().forEach((child) => {
        forEachRecursive(child, prefix + child.getChar(), word + child.getChar());
      });
    };

    return forEachRecursive();
  }
  
  /**
   * Converts the trie into an array of words
   * @public
   * @returns {array}
   */
  toArray() {
    const result = [];
    this.forEach((word) => result.push(word));
    return result;
  }

  /**
   * @public
   * @returns {number}
   */
  nodesCount() {
    return this._nodesCount;
  }

  /**
   * @public
   * @returns {number}
   */
  wordsCount() {
    return this._wordsCount;
  }

  /**
   * Clears the trie
   * @public
   */
  clear() {
    this._root = new TrieNode('');
    this._nodesCount = 1;
    this._wordsCount = 0;
  }

  /**
   * Converts an existing list into a trie
   * @public
   * @static
   * @returns {Trie}
   */
  static fromArray(values) {
    const trie = new Trie();
    values.forEach((value) => trie.insert(value));
    return trie;
  }
}

exports.Trie = Trie;
