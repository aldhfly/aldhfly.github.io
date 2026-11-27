/**
 * Three.js r128 BufferGeometryUtils (mergeGeometries / mergeBufferGeometries & mergeBufferAttributes)
 */
(function () {
  'use strict';
  if (typeof THREE === 'undefined') return;

  function mergeBufferAttributes(attributes) {
    let TypedArray;
    let itemSize;
    let normalized;
    let arrayLength = 0;

    for (let i = 0; i < attributes.length; ++i) {
      const attribute = attributes[i];
      if (attribute.isInterleavedBufferAttribute) return null;
      if (TypedArray === undefined) TypedArray = attribute.array.constructor;
      if (TypedArray !== attribute.array.constructor) return null;
      if (itemSize === undefined) itemSize = attribute.itemSize;
      if (itemSize !== attribute.itemSize) return null;
      if (normalized === undefined) normalized = attribute.normalized;
      if (normalized !== attribute.normalized) return null;
      arrayLength += attribute.array.length;
    }

    const array = new TypedArray(arrayLength);
    let offset = 0;
    for (let i = 0; i < attributes.length; ++i) {
      array.set(attributes[i].array, offset);
      offset += attributes[i].array.length;
    }
    return new THREE.BufferAttribute(array, itemSize, normalized);
  }

  function mergeBufferGeometries(geometries, useGroups = false) {
    const isIndexed = geometries[0].index !== null;
    const attributesUsed = new Set(Object.keys(geometries[0].attributes));
    const attributes = {};
    const mergedGeometry = new THREE.BufferGeometry();
    let offset = 0;

    for (let i = 0; i < geometries.length; ++i) {
      const geometry = geometries[i];
      let attributesCount = 0;
      if (isIndexed !== (geometry.index !== null)) return null;

      for (const name in geometry.attributes) {
        if (!attributesUsed.has(name)) return null;
        if (attributes[name] === undefined) attributes[name] = [];
        attributes[name].push(geometry.attributes[name]);
        attributesCount++;
      }
      if (attributesCount !== attributesUsed.size) return null;

      if (useGroups) {
        let count;
        if (isIndexed) {
          count = geometry.index.count;
        } else if (geometry.attributes.position !== undefined) {
          count = geometry.attributes.position.count;
        } else {
          return null;
        }
        mergedGeometry.addGroup(offset, count, i);
        offset += count;
      }
    }

    if (isIndexed) {
      let indexOffset = 0;
      const mergedIndex = [];
      for (let i = 0; i < geometries.length; ++i) {
        const index = geometries[i].index;
        for (let j = 0; j < index.count; ++j) {
          mergedIndex.push(index.getX(j) + indexOffset);
        }
        indexOffset += geometries[i].attributes.position.count;
      }
      mergedGeometry.setIndex(mergedIndex);
    }

    for (const name in attributes) {
      const mergedAttribute = mergeBufferAttributes(attributes[name]);
      if (!mergedAttribute) return null;
      mergedGeometry.setAttribute(name, mergedAttribute);
    }

    return mergedGeometry;
  }

  THREE.BufferGeometryUtils = {
    mergeBufferAttributes: mergeBufferAttributes,
    mergeBufferGeometries: mergeBufferGeometries,
    mergeGeometries: mergeBufferGeometries
  };
})();
