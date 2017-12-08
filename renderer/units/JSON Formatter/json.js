//
// The state of the parser, one of
// 'go'             The starting state
// 'ok'             The final, accepting state
// 'firstokey'      Ready for the first key of the object or the closing of an empty object
// 'okey'           Ready for the next key of the object
// 'colon'          Ready for the colon
// 'ovalue'         Ready for the value half of a key/value pair
// 'ocomma'         Ready for a comma or closing }
// 'firstavalue'    Ready for the first value of an array or an empty array
// 'avalue'         Ready for the next value of an array
// 'acomma'         Ready for a comma or closing ]
let state;
let stack;      // The stack, for controlling nesting.
let container;  // The current container object or array
let key;        // The current key
let value;      // The current value
// Escapement translation table
const escapes =
{
    '\\': '\\',
    '"': '"',
    '/': '/',
    't': '\t',
    'n': '\n',
    'r': '\r',
    'f': '\f',
    'b': '\b'
};
// The action table describes the behavior of the machine. It contains an object for each token.
// Each object contains a method that is called when a token is matched in a state.
// An object will lack a method for illegal states.
const action =
{
    '{':
    {
        go: function ()
        {
            stack.push ({ state: 'ok' });
            container = { };
            state = 'firstokey';
        },
        ovalue: function ()
        {
            stack.push ({ container: container, state: 'ocomma', key: key });
            container = { };
            state = 'firstokey';
        },
        firstavalue: function ()
        {
            stack.push ({ container: container, state: 'acomma' });
            container = { };
            state = 'firstokey';
        },
        avalue: function ()
        {
            stack.push ({ container: container, state: 'acomma' });
            container = { };
            state = 'firstokey';
        }
    },
    '}':
    {
        firstokey: function ()
        {
            let pop = stack.pop ();
            value = container;
            container = pop.container;
            key = pop.key;
            state = pop.state;
        },
        ocomma: function ()
        {
            let pop = stack.pop ();
            container[key] = value;
            value = container;
            container = pop.container;
            key = pop.key;
            state = pop.state;
        }
    },
    '[':
    {
        go: function ()
        {
            stack.push ({ state: 'ok' });
            container = [ ];
            state = 'firstavalue';
        },
        ovalue: function ()
        {
            stack.push ({ container: container, state: 'ocomma', key: key });
            container = [ ];
            state = 'firstavalue';
        },
        firstavalue: function ()
        {
            stack.push ({ container: container, state: 'acomma' });
            container = [ ];
            state = 'firstavalue';
        },
        avalue: function ()
        {
            stack.push ({ container: container, state: 'acomma' });
            container = [ ];
            state = 'firstavalue';
        }
    },
    ']':
    {
        firstavalue: function ()
        {
            let pop = stack.pop ();
            value = container;
            container = pop.container;
            key = pop.key;
            state = pop.state;
        },
        acomma: function ()
        {
            let pop = stack.pop ();
            container.push (value);
            value = container;
            container = pop.container;
            key = pop.key;
            state = pop.state;
        }
    },
    ':':
    {
        colon: function ()
        {
            if (container.hasOwnProperty (key))
            {
                throw new SyntaxError ("Duplicate key: \"" + key + "\".");
            }
            state = 'ovalue';
        }
    },
    ',':
    {
        ocomma: function ()
        {
            container[key] = value;
            state = 'okey';
        },
        acomma: function ()
        {
            container.push (value);
            state = 'avalue';
        }
    },
    'true':
    {
        go: function ()
        {
            value = true;
            state = 'ok';
        },
        ovalue: function ()
        {
            value = true;
            state = 'ocomma';
        },
        firstavalue: function ()
        {
            value = true;
            state = 'acomma';
        },
        avalue: function ()
        {
            value = true;
            state = 'acomma';
        }
    },
    'false':
    {
        go: function ()
        {
            value = false;
            state = 'ok';
        },
        ovalue: function ()
        {
            value = false;
            state = 'ocomma';
        },
        firstavalue: function ()
        {
            value = false;
            state = 'acomma';
        },
        avalue: function ()
        {
            value = false;
            state = 'acomma';
        }
    },
    'null':
    {
        go: function ()
        {
            value = null;
            state = 'ok';
        },
        ovalue: function ()
        {
            value = null;
            state = 'ocomma';
        },
        firstavalue: function ()
        {
            value = null;
            state = 'acomma';
        },
        avalue: function ()
        {
            value = null;
            state = 'acomma';
        }
    }
};
// The actions for number tokens
const number =
{
    go: function ()
    {
        state = 'ok';
    },
    ovalue: function ()
    {
        state = 'ocomma';
    },
    firstavalue: function ()
    {
        state = 'acomma';
    },
    avalue: function ()
    {
        state = 'acomma';
    }
};
// The actions for string tokens
const string =
{
    go: function ()
    {
        state = 'ok';
    },
    firstokey: function ()
    {
        key = value;
        state = 'colon';
    },
    okey: function ()
    {
        key = value;
        state = 'colon';
    },
    ovalue: function ()
    {
        state = 'ocomma';
    },
    firstavalue: function ()
    {
        state = 'acomma';
    },
    avalue: function ()
    {
        state = 'acomma';
    }
};
//
function debackslashify (text)
{
    // Remove and replace any backslash escapement.
    return text.replace (/\\(?:u(.{4})|([^u]))/g, function (a, b, c) { return (b) ? String.fromCharCode (parseInt (b, 16)) : escapes[c]; });
}
//
module.exports.parse = function (text)
{
    // Use a state machine rather than the dangerous eval function to parse a JSON text.
    // A regular expression is used to extract tokens from the JSON text.
    const tx = /^[\x20\t\n\r]*(?:([,:\[\]{}]|true|false|null)|(-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+\-]?[0-9]+)?)|"((?:[^\r\n\t\\\"]|\\(?:["\\\/trnfb]|u[0-9a-fA-F]{4}))*)")/;
    // The extraction process is cautious.
    let r;          // The result of the exec method.
    let i;          // The index shift in result array
    let actionFunc; // The current action function
    // Set the starting state.
    state = 'go';
    // The stack records the container, key, and state for each object or array
    // that contains another object or array while processing nested structures.
    stack = [ ];
    // If any error occurs, we will catch it and ultimately throw a syntax error.
    try
    {
        // For each token...
        while (true)
        {
            i = 0;
            r = tx.exec (text);
            if (!r)
            {
                break;
            }
            // r is the result array from matching the tokenizing regular expression.
            //  r[0] contains everything that matched, including any initial whitespace.
            //  r[1] contains any punctuation that was matched, or true, false, or null.
            //  r[2] contains a matched number, still in string form.
            //  r[3] contains a matched string, without quotes but with escapement.
            if (r[i + 1])
            {
                // Token: execute the action for this state and token.
                actionFunc = action[r[i + 1]][state];
            }
            else if (r[i + 2])
            {
                // Number token: convert the number string into a number value and execute
                // the action for this state and number.
                value = +r[i + 2];
                actionFunc = number[state];
            }
            else    // Do not test r[i + 3] explicitely since a string can be empty
            {
                // String token: replace the escapement sequences and execute the action for
                // this state and string.
                value = debackslashify (r[i + 3]);
                actionFunc = string[state];
            }
            //
            if (actionFunc)
            {
                actionFunc ();
                // Remove the token from the string. The loop will continue as long as there
                // are tokens. This is a slow process, but it allows the use of ^ matching,
                // which assures that no illegal tokens slip through.
                text = text.slice (r[0].length);
            }
            else
            {
                break;
            }
        }
    }
    catch (e)
    {
        // If we find a state/token combination that is illegal, then the action will
        // cause an error. We handle the error by simply changing the state.
        state = e;
    }
    // The parsing is finished. If we are not in the final 'ok' state, or if the
    // remaining source text contains anything except whitespace, then we did not have
    // a well-formed JSON text.
    if (state !== 'ok' || /[^\x20\t\n\r]/.test (text))
    {
        throw state instanceof SyntaxError ? state : new SyntaxError ("Invalid JSON.");
    }
    return value;
};
//
const escapable = /[\\\"\x00-\x1F\x7F-\x9F\u00AD\u0600-\u0604\u070F\u17B4\u17B5\u200C-\u200F\u2028-\u202F\u2060-\u206F\uFEFF\uFFF0-\uFFFF]/g;
const meta =  // table of character substitutions
{
    '\b': '\\b',
    '\t': '\\t',
    '\n': '\\n',
    '\f': '\\f',
    '\r': '\\r',
    '"' : '\\"',
    '\\': '\\\\'
};
let gap;
let indent;
let prefixIndent;
//
function quote (string)
{
    // If the string contains no control characters, no quote characters, and no
    // backslash characters, then we can safely slap some quotes around it.
    // Otherwise we must also replace the offending characters with safe escape
    // sequences.
    escapable.lastIndex = 0;
    return escapable.test (string) ?
        '"' + string.replace (escapable, function (a) {
            let c = meta[a];
            return (typeof c === 'string') ? c : '\\u' + ('0000' + a.charCodeAt (0).toString (16).toUpperCase ()).slice (-4);
        }) + '"' : '"' + string + '"';
}
//
function str (value)    // Produce a string from value.
{
    let i;  // The loop counter.
    let k;  // The member key.
    let v;  // The member value.
    let mind = gap;
    let partial;
    // What happens next depends on the value's type.
    switch (typeof value)
    {
        case 'string':
            return quote (value);
        case 'number':
            // JSON numbers must be finite. Encode non-finite numbers as null.
            return isFinite (value) ? String (value) : 'null';
        case 'boolean':
        case 'null':
            // If the value is a boolean or null, convert it to a string. Note:
            // typeof null does not produce 'null'. The case is included here in
            // the remote chance that this gets fixed someday.
            return String (value);
        case 'object':  // If the type is 'object', we might be dealing with an object or an array or null.
            // Due to a specification blunder in ECMAScript, typeof null is 'object',
            // so watch out for that case.
            if (!value)
            {
                return 'null';
            }
            // Make an array to hold the partial results of stringifying this object value.
            gap += indent;
            partial = [ ];
            // Is the value an array?
            if (Array.isArray (value))
            {
                // The value is an array. Stringify every element.
                for (i = 0; i < value.length; i++)
                {
                    partial[i] = str (value[i]);
                }
                // Join all of the elements together, separated with commas, and wrap them in brackets.
                v = (partial.length === 0) ?
                    (gap ? '[\n' + prefixIndent + mind + ']' : '[ ]') :
                    (gap ? '[\n' + prefixIndent + gap + partial.join (',\n' + prefixIndent + gap) + '\n' + prefixIndent + mind + ']' : '[ ' + partial.join (', ') + ' ]');
                gap = mind;
                return v;
            }
            else
            {
                // Iterate through all of the keys in the object.
                for (k in value)
                {
                    if (value.hasOwnProperty (k))
                    {
                        v = str (value[k]);
                        if (v)  // Useless ?
                        {
                            partial.push (quote (k) + (gap && ((v.charAt (0) === '{') || (v.charAt (0) === '[')) ? ':\n' + prefixIndent + gap : ': ') + v);
                        }
                    }
                }
                // Join all of the member texts together, separated with commas, and wrap them in braces.
                v = (partial.length === 0) ?
                    (gap ? '{\n' + prefixIndent + mind + '}' : '{ }') :
                    (gap ? '{\n' + prefixIndent + gap + partial.join (',\n' + prefixIndent + gap) + '\n' + prefixIndent + mind + '}' : '{ ' + partial.join (', ') + ' }');
                gap = mind;
                return v;
            }
        default:
            throw new SyntaxError ("Invalid JSON.");
    }
}
//
module.exports.stringify = function (value, space, prefix)
{
    // The stringify method takes a value, two optional parameters: space and prefix, and returns a JSON text.
    // Use of the space parameter can produce text that is more easily readable.
    // Use of the prefix parameter allows the insertion of the resulting text into some existing code already indented.
    let i;
    gap = '';
    indent = '';
    prefixIndent = '';
    //
    // If the space parameter is a number, make an indent string containing that many spaces.
    if (typeof space === 'number')
    {
        for (i = 0; i < space; i++)
        {
            indent += ' ';
        }
    }
    else if (typeof space === 'string') // If the space parameter is a string, it will be used as the indent string.
    {
        indent = space;
    }
    // If the prefix parameter is a number, make a prefix indent string containing that many spaces.
    if (typeof prefix === 'number')
    {
        for (i = 0; i < prefix; i++)
        {
            prefixIndent += ' ';
        }
    }
    else if (typeof prefix === 'string')    // If the prefix parameter is a string, it will be used as the prefix indent string.
    {
        prefixIndent = prefix;
    }
    // Return the result of stringifying the value.
    return prefixIndent + str (value);
};
//
