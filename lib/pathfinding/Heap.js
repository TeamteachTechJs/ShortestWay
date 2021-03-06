var Heap, defaultCmp, floor, heapify, heappop, heappush, heappushpop, heapreplace, insort, min, nlargest, nsmallest, updateItem, _siftdown, _siftup;

floor = Math.floor, min = Math.min;


defaultCmp = function(x, y) {
  if (x < y) {
    return -1;
  }
  if (x > y) {
    return 1;
  }
  return 0;
};


insort = function(a, x, lo, hi, cmp) {
  var mid;
  if (lo == null) {
    lo = 0;
  }
  if (cmp == null) {
    cmp = defaultCmp;
  }
  if (lo < 0) {
    throw new Error('lo must be non-negative');
  }
  if (hi == null) {
    hi = a.length;
  }
  while (lo < hi) {
    mid = floor((lo + hi) / 2);
    if (cmp(x, a[mid]) < 0) {
      hi = mid;
    } else {
      lo = mid + 1;
    }
  }
  return ([].splice.apply(a, [lo, lo - lo].concat(x)), x);
};


heappush = function(array, item, cmp) {
  if (cmp == null) {
    cmp = defaultCmp;
  }
  array.push(item);
  return _siftdown(array, 0, array.length - 1, cmp);
};


heappop = function(array, cmp) {
  var lastelt, returnitem;
  if (cmp == null) {
    cmp = defaultCmp;
  }
  lastelt = array.pop();
  if (array.length) {
    returnitem = array[0];
    array[0] = lastelt;
    _siftup(array, 0, cmp);
  } else {
    returnitem = lastelt;
  }
  return returnitem;
};

heapreplace = function(array, item, cmp) {
  var returnitem;
  if (cmp == null) {
    cmp = defaultCmp;
  }
  returnitem = array[0];
  array[0] = item;
  _siftup(array, 0, cmp);
  return returnitem;
};


heappushpop = function(array, item, cmp) {
  var _ref;
  if (cmp == null) {
    cmp = defaultCmp;
  }
  if (array.length && cmp(array[0], item) < 0) {
    _ref = [array[0], item], item = _ref[0], array[0] = _ref[1];
    _siftup(array, 0, cmp);
  }
  return item;
};


heapify = function(array, cmp) {
  var i, _i, _j, _len, _ref, _ref1, _results, _results1;
  if (cmp == null) {
    cmp = defaultCmp;
  }
  _ref1 = (function() {
    _results1 = [];
    for (var _j = 0, _ref = floor(array.length / 2); 0 <= _ref ? _j < _ref : _j > _ref; 0 <= _ref ? _j++ : _j--){ _results1.push(_j); }
    return _results1;
  }).apply(this).reverse();
  _results = [];
  for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
    i = _ref1[_i];
    _results.push(_siftup(array, i, cmp));
  }
  return _results;
};


updateItem = function(array, item, cmp) {
  var pos;
  if (cmp == null) {
    cmp = defaultCmp;
  }
  pos = array.indexOf(item);
  if (pos === -1) {
    return;
  }
  _siftdown(array, 0, pos, cmp);
  return _siftup(array, pos, cmp);
};


nlargest = function(array, n, cmp) {
  var elem, result, _i, _len, _ref;
  if (cmp == null) {
    cmp = defaultCmp;
  }
  result = array.slice(0, n);
  if (!result.length) {
    return result;
  }
  heapify(result, cmp);
  _ref = array.slice(n);
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    elem = _ref[_i];
    heappushpop(result, elem, cmp);
  }
  return result.sort(cmp).reverse();
};

nsmallest = function(array, n, cmp) {
  var elem, i, los, result, _i, _j, _len, _ref, _ref1, _results;
  if (cmp == null) {
    cmp = defaultCmp;
  }
  if (n * 10 <= array.length) {
    result = array.slice(0, n).sort(cmp);
    if (!result.length) {
      return result;
    }
    los = result[result.length - 1];
    _ref = array.slice(n);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      elem = _ref[_i];
      if (cmp(elem, los) < 0) {
        insort(result, elem, 0, null, cmp);
        result.pop();
        los = result[result.length - 1];
      }
    }
    return result;
  }
  heapify(array, cmp);
  _results = [];
  for (i = _j = 0, _ref1 = min(n, array.length); 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
    _results.push(heappop(array, cmp));
  }
  return _results;
};

_siftdown = function(array, startpos, pos, cmp) {
  var newitem, parent, parentpos;
  if (cmp == null) {
    cmp = defaultCmp;
  }
  newitem = array[pos];
  while (pos > startpos) {
    parentpos = (pos - 1) >> 1;
    parent = array[parentpos];
    if (cmp(newitem, parent) < 0) {
      array[pos] = parent;
      pos = parentpos;
      continue;
    }
    break;
  }
  return array[pos] = newitem;
};

_siftup = function(array, pos, cmp) {
  var childpos, endpos, newitem, rightpos, startpos;
  if (cmp == null) {
    cmp = defaultCmp;
  }
  endpos = array.length;
  startpos = pos;
  newitem = array[pos];
  childpos = 2 * pos + 1;
  while (childpos < endpos) {
    rightpos = childpos + 1;
    if (rightpos < endpos && !(cmp(array[childpos], array[rightpos]) < 0)) {
      childpos = rightpos;
    }
    array[pos] = array[childpos];
    pos = childpos;
    childpos = 2 * pos + 1;
  }
  array[pos] = newitem;
  return _siftdown(array, startpos, pos, cmp);
};

Heap = (function() {
  Heap.push = heappush;

  Heap.pop = heappop;

  Heap.replace = heapreplace;

  Heap.pushpop = heappushpop;

  Heap.heapify = heapify;

  Heap.updateItem = updateItem;

  Heap.nlargest = nlargest;

  Heap.nsmallest = nsmallest;

  function Heap(cmp) {
    this.cmp = cmp != null ? cmp : defaultCmp;
    this.nodes = [];
  }

  Heap.prototype.push = function(x) {
    return heappush(this.nodes, x, this.cmp);
  };

  Heap.prototype.pop = function() {
    return heappop(this.nodes, this.cmp);
  };

  Heap.prototype.peek = function() {
    return this.nodes[0];
  };

  Heap.prototype.contains = function(x) {
    return this.nodes.indexOf(x) !== -1;
  };

  Heap.prototype.replace = function(x) {
    return heapreplace(this.nodes, x, this.cmp);
  };

  Heap.prototype.pushpop = function(x) {
    return heappushpop(this.nodes, x, this.cmp);
  };

  Heap.prototype.heapify = function() {
    return heapify(this.nodes, this.cmp);
  };

  Heap.prototype.updateItem = function(x) {
    return updateItem(this.nodes, x, this.cmp);
  };

  Heap.prototype.clear = function() {
    return this.nodes = [];
  };

  Heap.prototype.empty = function() {
    return this.nodes.length === 0;
  };

  Heap.prototype.size = function() {
    return this.nodes.length;
  };

  Heap.prototype.clone = function() {
    var heap;
    heap = new Heap();
    heap.nodes = this.nodes.slice(0);
    return heap;
  };

  Heap.prototype.toArray = function() {
    return this.nodes.slice(0);
  };

  Heap.prototype.insert = Heap.prototype.push;

  Heap.prototype.top = Heap.prototype.peek;

  Heap.prototype.front = Heap.prototype.peek;

  Heap.prototype.has = Heap.prototype.contains;

  Heap.prototype.copy = Heap.prototype.clone;

  return Heap;

})();

export default Heap;

