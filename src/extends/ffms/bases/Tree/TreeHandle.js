import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const defaultProps = {
    data: [],
    defaultExpandIds: [],
    defaultCheckedIds: [],
    onlySelectLeaves: false,
    multiple: true,
    canCheck: true,

    recursiveChildren: true,

    onAfterInit: ()=>
    {

    },
};

const useTree = (props) =>
{
    const [data, setData] = useState([]);
    const [nodeSelected, setNodeSelected] = useState(null);
    props = { ...defaultProps, ...props };

    useEffect(()=>
    {
        const newData = JSON.parse(JSON.stringify(props.data)); // deep clone

        // assign parent for easy go up
        treeIterate(newData, (node, parent) =>
        {
            node.parent = parent;

            if (
                props.defaultExpandIds?.length > 0 &&
                props.defaultExpandIds.indexOf(node.id) !== -1 &&
                node.child?.length > 0
            )
            {
                node.expand = true;
            }
        });
        setData(newData);
    }, []);

    useEffect(()=>
    {
        if (data?.length > 0)
        {
            props.onAfterInit && props.onAfterInit(data);

            // wait for state already set
            if (props.nodeSelected)
            {
                checkIds(props.nodeSelected?.map(node=>node.id), 1, true);
            }
        }

    }, [data.length > 0]);

    const loadTree = (data, cb = null) =>
    {
        setData(data);
        cb && cb(data);
    };


    const expandAll = (nodes, expand, saveOrigin = false) =>
    {
        treeIterate(nodes, (node) =>
        {
            if (saveOrigin && node.originExpand == null)
            {
                node.originExpand = node.expand;
            }

            node.expand = expand;
        });
        setData([...nodes]);
    };

    // function to traverse tree and callback on every node, to simplify tree manipulation -> use it like forEach on array
    const treeIterate = (trees, cb, done) =>
    {
        const iterate = (parent, cb) =>
        {
            if (parent.child)
            {
                for (const node of parent.child)
                {
                    cb(node, parent);
                    iterate(node, cb);
                }
            }
        };

        for (const node of trees)
        {
            cb(node, null);
            iterate(node, cb);
        }

        done && done();
    };


    const treeUp = (node, cb) =>
    {
        if (node.parent)
        {
            cb(node.parent);

            treeUp(node.parent, cb);
        }
    };

    const recursiveChecked = (node, checkingType) =>
    {
        treeIterate([node], (child) =>
        {
            child.checkingType = checkingType;
        });
    };

    const recursiveParentChecked = (node) =>
    {
        treeUp(node, (parent) =>
        {
            const childPartialChecked = parent.child.filter((child) => child.checkingType === 2).length;
            if (childPartialChecked === 0)
            {
                const childChecked = parent.child.filter((child) => child.checkingType === 1).length;
                parent.checkingType = childChecked === 0 ? 0 : parent.child.length === childChecked ? 1 : 2;
            }
            else
            {
                parent.checkingType = 2;
            }
        });

    };

    const restoreExpand = (nodes) =>
    {
        treeIterate(nodes, (node) =>
        {
            if (node.originExpand != null)
            {
                node.expand = node.originExpand;
                delete node.originExpand;
            }
        });
    };

    const checkAll = (data, checkingType, done) =>
    {
        if (checkingType === 2)
        {
            return;
        }
        else if (data?.length > 0)
        {
            treeIterate(data,
                node => node.checkingType = checkingType,
                ()=>
                {
                    done && done(data);
                });
        }
    };

    const check = (node, checkingType, cb) =>
    {
        if (!props.canCheck)
        {
            return ;
        }

        if (!props.multiple)
        {
            checkAll(data,0);
        }

        node.checkingType = checkingType;

        // child
        props.recursiveChildren && recursiveChecked(node, checkingType);

        // parent
        recursiveParentChecked(node);

        // event
        const nodeSelected = [];
        treeIterate(data, (node) =>
        {
            if (node.checkingType === 1)
            {
                if (props.onlySelectLeaves)
                {
                    if (!node.child || node.child.length === 0)
                    {
                        nodeSelected.push(node);
                    }
                }
                else
                {
                    nodeSelected.push(node);

                    // to return node selected when select
                    cb && cb(nodeSelected);
                }
            }
        },
        () =>
        {
            setData(data);
            setNodeSelected(nodeSelected);
        });
    };

    const checkIds = (ids,checkingType, clearOld,cb) =>
    {
        const nodeSelected = [];

        if (!props.canCheck)
        {
            return ;
        }

        if (clearOld)
        {
            checkAll(data,0);
        }

        treeIterate(data,(node)=>
        {
            if (ids.indexOf(node.id) !== -1 && node.checkingType !== checkingType)
            {
                node.checkingType = checkingType;

                // child
                props.recursiveChildren && recursiveChecked(node, checkingType);

                // parent
                recursiveParentChecked(node);
            }
        });

        // event
        treeIterate(data, (node) =>
        {
            if (node.checkingType === 1)
            {
                if (props.onlySelectLeaves)
                {
                    if (!node.child || node.child.length === 0)
                    {
                        nodeSelected.push(node);
                    }
                }
                else
                {
                    nodeSelected.push(node);

                    // to return node selected when select
                    cb && cb(nodeSelected);
                }
            }
        },
        () =>
        {
            setData(data);
            setNodeSelected(nodeSelected);
        });
    };

    const expand = (node, isExpand) =>
    {
        node.expand = isExpand;

        // can make remote expand here by call out expand event and wait to receive child than use it to set data state again
        setData([...data]);
    };

    const updateNode = (node, config) =>
    {
        for (const fieldName in config)
        {
            if (node.hasOwnProperty(fieldName))
            {
                node[fieldName] = config[fieldName];
            }
        }

        setData([...data]);
    };
    
    const expandIds = (ids, isExpand) =>
    {
        const data = JSON.parse(JSON.stringify(props.data)); // deep clone

        // assign parent for easy go up
        treeIterate(data, (node, parent) =>
        {
            if (
                ids?.length > 0 &&
                ids.indexOf(node.id) !== -1 &&
                node.child?.length > 0
            )
            {
                node.expand = isExpand;
            }
        },()=>
        {
            setData([...data]);
        });
    };

    const filter = (keyFilter) =>
    {

        if (keyFilter !== '')
        {
            treeIterate(data, (node) =>
            {
                node.visible = node.label.toLowerCase().includes(keyFilter.toLowerCase());

                if (node.visible)
                {
                    treeUp(node, (parent) =>
                    {
                        parent.visible = true;
                    });
                }
            });

            expandAll(data, true, true);
        }
        else
        {
            treeIterate(data, (node) =>
            {
                node.visible = true;
            });

            restoreExpand(data);
        }

        setData([...data]);
    };

    const getNodeById = (id) =>
    {
        let nodeGet ;
        treeIterate(data, (node, parent) =>
        {
            if (node.id === id)
            {
                node.parent = parent;
                nodeGet = node;
            }
        });
        return nodeGet;
    };

    return [
        {
            data,
            nodeSelected,
        },
        {
            expand,
            expandIds,
            expandAll,
            filter,
            check ,
            checkAll,
            checkIds,
            getNodeById,

            updateNode,
            loadTree,
        }];
};

useTree.propTypes = {
    data: PropTypes.array,
    nodeSelected: PropTypes.array,

    // multiple select
    multiple: PropTypes.bool,

    // only return node leave when select
    onlySelectLeaves: PropTypes.bool,

    // recursive children when check
    recursiveChildren: PropTypes.bool,

    //  has the ability to check
    canCheck: PropTypes.bool,

    // fuction will call after init data
    onAfterInit: PropTypes.func,

    // default expand ids
    defaultExpandIds: PropTypes.array,
    // default checked ids
    defaultCheckedIds: PropTypes.array,
};

export default useTree;
